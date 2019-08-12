const request = require('request');
const https = require('https');
const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const fs = require('fs');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

PDFDocument.prototype.addSVG = function(svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

exports.handler = async (event, context, callback) => {
    const options = JSON.parse(event.body);
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
/aaa/bbb/ccc.ddd
    const path = "https://snaptageditor.com/webApp/resources/ajax/generate.php";
    const response = await new Promise((resolve, reject) => {
        console.log(event.body);
        const stream = request({
            url: path,
            method: event.httpMethod,
            timeout: 10000,
            form: event.httpMethod === 'POST' && options,
            agent: new https.Agent({
                host: 'snaptageditor.com',
                port: '443',
                path: '/webApp/resources/ajax/generate.php',
                rejectUnauthorized: false
            })
        }, (err, originalResponse, body) => {
            if (err) {
                callback(err);

                reject(err);

                return;
            }

            console.log(`Got response from ${path} ---> {statusCode: ${originalResponse.statusCode}}`);
            const proxyBody = options ? body : originalResponse.body;
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
    let svg = response.body;

    if(options.isRotated) {
        svg = svg.replace("<image", `<image transform="rotate(-45) translate(-160 64.52)"`);
    }

    const doc = new PDFDocument();
    doc.addSVG(svg, 0, 0);
    doc.save();
    
    const file = await savePdfToFile(doc, "test.pdf");

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: file
    }
};

function savePdfToFile(pdf, fileName) {
  return new Promise((resolve, reject) => {

    // To determine when the PDF has finished being written successfully 
    // we need to confirm the following 2 conditions:
    //
    //   1. The write stream has been closed
    //   2. PDFDocument.end() was called syncronously without an error being thrown

    let pendingStepCount = 2;

    const stepFinished = () => {
      if (--pendingStepCount == 0) {
        resolve();
      }
    };

    const writeStream = fs.createWriteStream(fileName);
    writeStream.on('close', stepFinished);
    pdf.pipe(writeStream);

    pdf.end();

    stepFinished();
  });
}
