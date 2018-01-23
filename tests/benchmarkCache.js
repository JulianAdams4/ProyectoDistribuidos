var apiBenchmark = require('api-benchmark');
var fs = require('fs');


var service = {
  Using: "http://localhost:3000"
};


var routes = {
	Cache: '/microservice'
};


var options = {
	minSamples: process.argv[2] ? parseInt(process.argv[2]) : 30,
	maxConcurrentRequests: process.argv[3] ? parseInt(process.argv[3]) : 30,
  runMode: process.argv[4] ? process.argv[4] : 'sequence'
}


apiBenchmark.measure(service, routes, options, function(err, results){
  apiBenchmark.getHtml(results, function(error, html){
  	const filePath = __dirname + '/../views/benchmarkCache.ejs';
    fs.writeFileSync(filePath, html);
  });
});