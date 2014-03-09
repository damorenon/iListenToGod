document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("aquí internacionalizar")
}



/*

var url1 = "http://jesussalvamifamilia.org/il2g/getOneQuote.json.php?idioma=1";
var url2 = "http://localhost:3000/rest/il2g/getOneQuote.json.php?idioma=1";
var url3 = "http://localhost:3000/rest/il2g/getOneQuote.json.php";

$(document).on("click","#consultar", function(){
	console.log("hiciste click");
	$.ajax({
	  type: "GET",
	  url: url3,
	  datatype: "json"
	}).done(function(data){
		alert("la rta: " + JSON.stringify(data) )
	}).error(function(jqXHR, textStatus, m) {
    	alert("jqXHR: " + JSON.stringify(jqXHR) +" textStatus: "+ textStatus);
    });
});

*/


	