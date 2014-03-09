var http = require('http');
var destinationHost = 'jesussalvamifamilia.org';

module.exports = {
		
	invoke: function(req, res, data){
		
		var url = req.url;
		
	//----------------------Peticiones POST al server remoto-----------------------------------
		if (req.method == 'POST') {
			
			if(data != undefined){
				var options = {
					host: destinationHost,
					path: url.replace(/^\/rest(\/.*)/, '$1'),
					method: 'POST',
				};
				var post_req = http.request(options, function(response) {
					var response_data = '';
					response.on('data', function (chunk) {
						response_data += chunk.toString();
					});

					response.on('end', function () {
						res.writeHead(200, "OK", {'Content-Type': 'application/json'});
						res.end(response_data);
						console.log('\t"' + url+ '": {');
						console.log('\t\t"'+ data.replace(/"/g, '\\"') + '": {response: "'+response_data.replace(/"/g,'\\"')+'"}');
						console.log('\t}');
					})	;
				});
				post_req.write(new Buffer(data, 'utf8'));
				post_req.end();
				
			}else{
				data= '';
				req.on('data', function(chunk) {
					data += chunk.toString();
				});

				req.on('end', function() {
					var options = {
						host: destinationHost,
						path: url.replace(/^\/rest(\/.*)/, '$1'),
						method: 'POST',
					};

					var post_req = http.request(options, function(response) {
						var response_data = '';
						response.on('data', function (chunk) {
							response_data += chunk.toString();
						});
						
						response.on('end', function () {
							res.writeHead(200, "OK", {'Content-Type': 'application/json'});
							res.end(response_data);
							console.log('\t"' + url+ '": {');
							console.log('\t\t"'+ data.replace(/"/g, '\\"') + '": {response: "'+response_data.replace(/"/g,'\\"')+'"}');
							console.log('\t}');
						});
					});

					post_req.write(new Buffer(data, 'utf8'));
					post_req.end();
				});
			}


	//----------------------Peticiones GET al server remoto-----------------------------------
		} else if (req.method == 'GET'){

			/* Para peticiones por proxy corporativo
			var options = {
			  host: proxyHost,
			  port: proxyPort,
			  path: 'http://'+destinationHost+url.replace(/^\/rest(\/.*)/, '$1'),				
			  method: 'GET',
			  headers: { 
				  Host: destinationHost
			  }
			};*/
			var options = {
					host: destinationHost,
					path: url.replace(/^\/rest(\/.*)/, '$1'),
					method: 'GET'
			};
			
			var mockUrl = url;
			var mockData = '{"no-req":"data"}';
			if( data != '{"no-req":"data"}' ){
				mockUrl = url.substring(0, url.indexOf("?"));
				mockData = data.replace(/"/g, '\\"');
			}
			
			var get_req = http.request(options, function(response) {
				var response_data = '';
				response.on('data', function (chunk) {
					response_data += chunk.toString();
				});
				
				response.on('end', function () {
					res.writeHead(200, "OK", {'Content-Type': 'application/json'});
					res.end(response_data);
					console.log('\t"' + mockUrl + '": {');
					console.log('\t\t"'+ mockData + '": {response: "'+response_data.replace(/"/g,'\\"')+'"}');
					console.log('\t}');
				});
			});
			get_req.write(new Buffer(data, 'utf8'));
			get_req.end();

	//--------------------------------------------------------------------------------------------------	
		}else{
			res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
			res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
		}
	}

}
