const fs = require("fs");
const http = require("http");
const url = require('url');
const path = require("path");
const zlib = require('zlib');

let server = http.createServer(), rules = {};

fs.readFile(path.resolve(__dirname, ), (err, data) => {
    if (err) throw err;

    try{
        rules = JSON.parse(data);
        console.log(rules);
    }catch(e){
        throw e;
    }
});

server.listen(1337, "127.0.0.1", function () {
    console.log("开始监听" + server.address().port + "......");
});

server.on('request', (request, response) => {
    console.log('request ' + request.url);
    let options = url.parse(request.url);
    options.headers = request.headers;
    options.method = request.method;
    options.agent = false;

    let connector = http.request(options, function(svrResponse) {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

            if( whielist(request.url) ){
                //svrResponse.pause();
                response.writeHeader(svrResponse.statusCode, svrResponse.headers);
                svrResponse.pipe(response, {end:true}); //{end:true}
                // svrResponse.resume();
                return;
            }

            let buffers = [], 
                contentType = svrResponse.headers['content-type'], //'text/html'
                contentEncoding = svrResponse.headers['content-encoding'];

            svrResponse.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                buffers.push(chunk);
            });

            svrResponse.on('end', () => {
                console.log('No more data in response.');
                let regEncoding = /(gzip|deflate)/;
                if(regEncoding.test(contentEncoding)){
                    zlib.unzip(Buffer.concat(buffers), (err, buffer) => {
                        if (!err) {
                            console.log(buffer.toString('base64'));
                            return;
                        }  

                        let body = JSON.parse( buffer.toString() );
                        response.writeHeader(svrResponse.statusCode, svrResponse.headers);

                        fs.readFile(path, (err, buffer){

                        });

                        response.end(body);
                    })
                }else{

                }

            });
    });
    request.pipe(connector, {end:true});

    var urlObject = url.parse(request.url),
        opts = {
            host: "www.taobao.cn",
            port: 80,
            path: urlObject.pathname,
            headers: urlObject.headers
        },
        method = request.method;
    console.log('request ' + request.url);
    request.pause();

    if (handles[method]) {
        handles[method](request, response)
    } else {
        creq = http.get(opts, function (cres) {
            sres.writeHead(cres.statusCode, cres.headers);
            cres.pipe(sres);
        });

        sreq.pipe(creq);
    }
});