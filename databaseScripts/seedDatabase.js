const csvParser = require('csv-parse');
const envs = require('./../env/envs');
const mysql = require('mysql');
const fs = require('fs');
const filepath = "./newsCorpora.csv";
const delimiter = '\t';


const options = {
	mysql: {
		host: '127.0.0.1',
		user: envs.user,
		password: envs.password,
		database: envs.database,
	},
	table: envs.tableName,
	headers: ["num_noticia", "titulo", "descripcion", "num_accesos"]
}


const connection = mysql.createConnection(options.mysql);

const minValue = 0;
const maxValue = 100000;


const resizeData = (data, indexes) => {
	var newData = [];
	data.forEach( item => {
		var newItem = [];
		for (var i = 0; i < item.length; i++) {
			if ( indexes.indexOf(i) > -1 ) {
				newItem.push(item[i]);
			}
		}
		newItem.push(getRandomInt(minValue, maxValue));
		newData.push(newItem);
	});
	return newData;
}


const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


fs.readFile( filepath , { encoding: 'utf-8' }, function(err, csvData) {
	if (err) throw new Error("Error al leer el archivo");

	csvParser( csvData, { delimiter: delimiter }, function(err, data) {
		if (err){ throw err }
		else {
			var resizedData = resizeData(data, [1,2]);
			connection.connect();
			
			const initialQuery = "CREATE TABLE IF NOT EXISTS `"+options.table+"` "+
				"(`num_noticia` INTEGER auto_increment , `titulo` VARCHAR(255),"+
				"`descripcion` VARCHAR(255), `num_accesos` INTEGER DEFAULT 0,"+
				" PRIMARY KEY (`num_noticia`)) ENGINE=InnoDB;";
			// Creamos la tabla si no existe aun
			connection.query( initialQuery , function (error, results, fields) {
			 	if (error) throw error;
			});

			// Limpiamos la tabla **
			const cleanTable = "TRUNCATE TABLE noticias";
			connection.query( cleanTable , function (error, results, fields) {
			 	if (error) throw error;
			});

			const fillTable = "INSERT INTO "+ options.table +" (" + 
					options.headers[1]+"," + 
					options.headers[2]+"," + 
					options.headers[3]+
				") VALUES ?";
			// Insertamos la data del csv
			connection.query( fillTable , [resizedData], function (error, results, fields) {
			 	if (error) throw error;
			 	//console.log(results);
			});

			connection.end();
		}
	});
});
