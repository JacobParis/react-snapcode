// Request API data and merge by timeline
const request = require('request');

exports.handler = async (event, context, callback) => {
    const params = Object.keys(event.queryStringParameters).map(key => key + '=' + event.queryStringParameters[key]).join('&');
/*
    const path = `${event.path.replace(/.*http/, 'http')}?${params}`;
    if (!path) {
        const errorResponse = {
            statusCode: 400,
            body: 'Unable get url from \'url\' query parameter'
        };

        callback(null, errorResponse);

        return;
    }
*/

    const response = await new Promise((resolve, reject) => {
        let originalRequestBody = event.body;
        console.log(event.body);
        const stream = request({
            url: "https://snaptageditor.com/webApp/resources/ajax/generate.php",
            method: event.httpMethod,
            timeout: 10000,
            form: event.httpMethod === 'POST' && formToJSON(originalRequestBody),
        }, (err, originalResponse, body) => {
            if (err) {
                callback(err);

                reject(err);

                return;
            }

            console.log(`Got response from ${path} ---> {statusCode: ${originalResponse.statusCode}}`);
            const proxyBody = originalRequestBody ? body : originalResponse.body;
            const proxyResponse = {
                statusCode: originalResponse.statusCode,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                    "content-type": originalResponse.headers['content-type']
                },
                body: proxyBody
            };

            resolve(proxyResponse);
        });

        let length = 0;
        stream.on('data', function (chunk) {
            length += chunk.length;
            if (length > 2e8) {
                stream.emit('error', new Error('the response is too long'));
                return;
            }
        })
    });

    //if(response.statusCode !== 200) return response;

    
    const body = response.body;
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: body
    }
};

function formToJSON(form) {
    return Object.fromEntries([form.split('=')])
}