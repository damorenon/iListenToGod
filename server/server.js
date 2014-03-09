var baseDir = '../il2g/www'
var http = require('http');
var fs = require('fs');

if(process.argv[2] == 'proxy'){	
	console.log('running server as proxy');
	var proxy = require('./proxyService');
}else{
	console.log('running server with mocks');
	var proxy = require('./mockService');
}

http.createServer(function (req, res) {
	var url = req.url;
	if(url.match(/^\/rest\/.*/)){
		proxy.invoke(req, res);
	}else{
		try{
			if(url == '/'){
				url = '/index.html';
			}
			if(url=='terminate'){
				procces.exit();
			}
			var response = fs.readFileSync(baseDir + url);
			var fileType = url.replace(/.*\.(.+)/, "$1");
			var contentType = 'text/plain';
			switch(fileType){
				case 'html': contentType = 'text/html'; break;
				case 'css' : contentType = 'text/css'; break;
				case 'js' : contentType = 'text/javascript'; break;
				case 'otf' : contentType = 'application/octet-stream'; break;
			}
			res.writeHead(200, "OK", {'Content-Type': contentType});
			res.end(response);
		}catch(e){
			res.writeHead(404);
			res.end();
		}
	}
}).listen(3000);