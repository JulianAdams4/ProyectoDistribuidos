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
var envs = require('./env/envs');





//===========================
//		MySQL
//===========================
/*------------------------
*	Creando la conexión  
*--------------------------*/
const sequelize = new Sequelize({
  database: envs.database,
  username: envs.user, 
  password: envs.password,
  dialect: envs.dialect, 
  logging: false
});

/*------------------------------  
*	Probando conexión MySQL  
*------------------------------*/
sequelize
  .authenticate()
  .then(() => {
    console.log('[MySQL] Conectado con la BDD.');
  })
  .catch( err => {
    throw new Error('[MySQL] No se pudo conectar con la BDD: ', err);
  });

/*------------------------------  
*	Configurando el modelo
*------------------------------*/
var NoticiasModel = sequelize.define( envs.tableName , 
  {
    num_noticia: {
      type: Sequelize.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    titulo: Sequelize.STRING,
    descripcion: Sequelize.STRING,
    num_accesos: {
      type: Sequelize.INTEGER, 
      defaultValue: 0
    }
  },
  { timestamps: false }
);

NoticiasModel.sync();





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
*	Función que obtiene las noticias
*	de la BDD
*-----------------------------------*/
function ObtenerDeBDD(limite, fn){
	NoticiasModel.findAll({ 
    limit: limite,
    order: [
      ['num_accesos', 'DESC']
    ] 
  }).then( noticias => {
		var data = noticias.map((noticia) => { 
			return noticia.get({ plain: false }) 
		});
    fn(data);
  });
}

/*-----------------------------------
*	Función que verifica si una
*	busqueda está en caché, caso
*	contrario, continua a la
*	siguiente función.
*-----------------------------------*/
const VerificarCache = (req, res, next) => {
  const start = new Date();
  // Usuario a buscar
    const fechaAMD = new Date().toISOString().replace(/T.+/, '');
    // Consultamos la caché de Redis
    client.get(fechaAMD, (error, result) => {
      // El resultado está en caché -> Retornarlo inmediatamente
      if (result) {
        var data = JSON.parse(result);
        return res.render('index', { 
          title: 'Top 10 noticias',
          from: "Redis cache",
          responseTime: new Date() - start,
          noticias: data
        });
      }
      // El resultado no está en cache -> continúa a la sgt función
      else {
        next();
      }
    });
}

/*-----------------------------------
*	Función que guarda un par
*	<clave, valor> en caché,
*	durante un determinado tiempo
*-----------------------------------*/
function GuardarEnCache(clave, valor, tiempo) {
	var duracion = ((tiempo)&&(tiempo>0)) ? tiempo : 60;
	client.setex(clave, duracion, valor);
}



//================================
//		Rutas
//================================
/*-------------------------------
*	Cargar pagina principal
*--------------------------------*/
app.get('/', VerificarCache, function(req, res, next) {
  	var start = new Date();
  	// Se consulta la BDD
	ObtenerDeBDD(10, (data) => {
 		// Generamos la clave (fecha de hoy)
  	var fechaAMD = new Date().toISOString().replace(/T.+/, '');
		// Guardamos la key-value <fechaAMD, totalStars> en caché
		// Expira en 1 minuto (60s)
		GuardarEnCache(fechaAMD, JSON.stringify(data), envs.caheTime);
  	return res.render('index', { 
  		title: 'Top 10 noticias',
  		from: "Base de datos",
  		responseTime: new Date() - start,
  		noticias: data
  	});
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
