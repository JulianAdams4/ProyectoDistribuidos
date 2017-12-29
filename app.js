//===========================
//		Dependencias
//===========================
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var responseTime = require('response-time')
var axios = require('axios');
var redis = require('redis');
var Sequelize = require('sequelize');





//===========================
//		MySQL
//===========================
/*------------------------
*	Creando la conexión  
*--------------------------*/
const sequelize = new Sequelize({
  database: 'distribuidos',
  username: 'root', password: 'root',
  dialect: 'mysql'
});

/*------------------------------  
*	Probando conexión MySQL  
*------------------------------*/
sequelize
  .authenticate()
  .then(() => {
    console.log('[MySQL] Conectado con la BDD.');
  })
  .catch(err => {
    console.error('[MySQL] No se pudo conectar con la BDD: ', err);
  });

/*------------------------------  
*	Configurando el modelo
*------------------------------*/
var NoticiasModel = sequelize.define('noticias', {
  num_noticia: { 
    type: Sequelize.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  titulo: Sequelize.STRING,
  descripcion: Sequelize.STRING,
  num_accesos: Sequelize.INTEGER
});





//===========================
//		Redis
//===========================
/*------------------------------------------
*	Create a new redis client and connect 
*	to our local redis instance
*-------------------------------------------*/
const REDIS_PORT = process.env.REDIS_PORT;
var client = redis.createClient(REDIS_PORT);

/*------------------------------
*	If an error occurs, 
*  	print it to the console
*-------------------------------*/
client.on('error', function (err) {
    console.log("[Redis] Error al conectarse: " + err);
});




//========================================
//		Confguración de la app
//========================================
var app = express();
/*-------------------------------
*    View engine
*-------------------------------*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*-------------------------------
*    Response-time middleware
*-------------------------------*/
app.use(responseTime());

/*------------------------------------------
*    Log por consola de los requerimientos
*-------------------------------------------*/
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));





//===================================
//		Funciones 
//====================================
/*-----------------------------------
*	Call the GitHub API to fetch 
*	information about the 
*	user's repositories
*-----------------------------------*/
function getUserRepositories(user) {
  var githubEndpoint = 'https://api.github.com/users/' + user + '/repos' + '?per_page=100';
  return axios.get(githubEndpoint);
}

/*-----------------------------------
*	Add up all the stars and return 
*	the total number of stars 
*	across all repositories
*-----------------------------------*/
function computeTotalStars(repositories) {
  return repositories.data.reduce(function(prev, curr) {
    return prev + curr.stargazers_count
  }, 0);
}

/*-----------------------------------
*	...
*	...
*	...
*-----------------------------------*/
function GuardarEnBD(){
sequelize
  .query('SELECT * FROM projects', { model: Projects })
  .then(projects => {
    // Each record will now be mapped to the project's model.
    console.log(projects)
  })
}

/*-----------------------------------
*	Función que verifica si una
*	busqueda está en caché, caso
*	contrario, continua a la
*	siguiente función.
*-----------------------------------*/
function cache(req, res, next) {
	// Usuario a buscar
  	var fechaAMD = new Date().toISOString().replace(/T.+/, '');
  	// Consultamos la caché de Redis
  	client.get(fechaAMD, function(error, result) {
    	// El resultado está en caché -> Retornarlo inmediatamente
    	if (result) {
      		return res.status(200).json({ "ValorBusqueda": result, "Origen": "Redis cache" });
    	}
    	// El resultado no está en cache -> continúa a la sgt función
    	else {
      		next();
    	}
  	});
}





//================================
//		Rutas
//================================
/*-------------------------------
*	Cargar pagina principal
*--------------------------------*/
app.get('/', function(req, res, next) {
  	res.render('index', { title: 'Top 10 noticias' });
});

/*----------------------------------------
*	If a user visits /api, 
*	return the total number of 
*	stars 'facebook' has across all 
*	it's public repositories on GitHub
*-----------------------------------------*/
app.get('/api', cache, function(req, res) {
 	// Username parameter in the URL
  	var username = "facebook";
  	var fechaAMD = new Date().toISOString().replace(/T.+/, '');
  	// Si la busqueda no está en caché, se consulta la BDD
  	getUserRepositories(username)
    .then(computeTotalStars)
    .then(function(totalStars) {
      	// Guardamos la key-value <fechaAMD, totalStars> en caché
      	// Expira en 1 minuto (60s)
      	client.setex(fechaAMD, 60, totalStars);
    	// Retorna el resultado al usuario
    	return res.status(200).json({ "ValorBusqueda": totalStars, "Origen": "GitHub API" });
    })
    .catch(function(response) {
    	if (response.status === 404){
      		return res.send('The GitHub username could not be found.');
    	} 
    	else {
      		return res.send(response);
    	}
    });
});





//==================================================
//		Rutas no encontradas
//		Catch 404 and forward to error handler
//==================================================
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);  // Continua al Error handler
});





//===========================
//		Error handler
//===========================
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
