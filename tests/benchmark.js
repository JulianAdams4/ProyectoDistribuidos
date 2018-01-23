var apiBenchmark = require('api-benchmark');
var fs = require('fs');


var service = {
  Servidor_NodeJs: "http://localhost:3000"
};


var routes = {
	home : '/'
};

console.log(process.argv)

var options = {
	minSamples: process.argv[2] ? parseInt(process.argv[2]) : 10,
	maxConcurrentRequests: process.argv[3] ? parseInt(process.argv[3]) : 10,
  runMode: process.argv[4] ? process.argv[4] : 'parallel'
}


apiBenchmark.measure(service, routes, options, function(err, results){
  apiBenchmark.getHtml(results, function(error, html){
  	const filePath = __dirname+'/../views/benchmark.ejs';
    fs.writeFileSync(filePath, html);
  });
});