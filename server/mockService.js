var proxy = require('./proxyService');
var urlq = require('url');

module.exports = {
		
	invoke: function(req, res){		
	//--------------Para peticiones POST al server local--------------
		if (req.method == 'POST'){
			var url = req.url;
			var mock = mocks[url];
			if(mock != undefined){
				var post_data = '';
				req.on('data', function(chunk) {
					post_data += chunk.toString();
				});
				req.on('end', function() {
					var response = mock[post_data];
					if(response == undefined){
						var data = findBestResponse(post_data, mock);
						if(data != undefined){
							res.writeHead(200, "OK", {'Content-Type': 'application/json'});
							res.end(data);
						}else{
							proxy.invoke(req, res, post_data);
						}
					}else{
						res.writeHead(200, "OK", {'Content-Type': 'application/json'});
						res.end(mock[post_data].response);
					}
				});
			}else{
				proxy.invoke(req, res);
			}
		}		
	//---------------Para peticiones GET al server local-----------------
		if (req.method == 'GET'){
			var urlObject = urlq.parse(req.url,true);
			var url = urlObject.pathname;
			var mock = mocks[url];		
			var get_data = JSON.stringify(urlObject.query);
			if(get_data == '{}'){
				get_data = '{"no-req":"data"}';
			}
			if(mock !== undefined){
				var response = mock[get_data];
				if(response === undefined){
					var data = findBestResponse(get_data, mock);
					if( data !== undefined ){
						res.writeHead(200, "OK", {'Content-Type': 'application/json'});
						res.end(data);
						console.log("mock");
					}else{
						console.log("remote con data: "+get_data);
						proxy.invoke(req, res, get_data);
					}
				}else{
					res.writeHead(200, "OK", {'Content-Type': 'application/json'});
					res.end( mock[get_data].response );
					console.log("mock");
				}
			}else{
				console.log("ningún mock encontrado, buscando en remoto con get_data: "+get_data);
				proxy.invoke(req, res, get_data);
			}
		}		
	//----------------------------------------------------------
	}
}


findBestResponse = function(data, mock){
	for(i in mock){
		if(mock[i].keyRegex == true){
			var patt=new RegExp(i);
			if(patt.test(data)){
				console.log('mock');
				return mock[i].response;
			}
		}
	}
	return undefined;
}


var mocks = 
{
	"/rest/il2g/getOneQuote.json.php": {
		"{\"idioma\":\"1\"}": {response: '[{\"id\":\"2041\",\"id_fuente\":\"2\",\"fuente\":\"San Agustin\",\"temas_cita\":\"2042\",\"cita\":\"When we pray we talk to God,  but when we read it is God who speaks to us. (San Agustine)\"}]'},
		"{\"no-req\":\"data\"}": {response: "[{\"id\":\"2913\",\"id_fuente\":\"1\",\"fuente\":\"Biblia\",\"temas_cita\":\"2914\",\"cita\":\"En efecto,  Herodes mismo hab\u00eda mandado que arrestaran a Juan y que lo encadenaran en la c\u00e1rcel.  Herodes se hab\u00eda casado con Herod\u00edas,  esposa de Felipe su hermano,  y Juan le hab\u00eda estado diciendo a Herodes: La ley te proh\u00edbe tener a la esposa de tu hermano. (Marcos 6, 17-18)\"}]"}
	}


	/*
	"/rest/il2g/getOneQuote.json.php": {
		'.*': {response: "Mock de prueba"},
		'{"idioma":"1"}': {response: '{ "prueba": "Mock de prueba 2" }'}
	}
	*/
};

