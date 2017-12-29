/*-------------------------
    Dependencias
--------------------------*/
var express = require('express');
var router = express.Router();


/*-------------------------
    Página principal 
--------------------------*/
router.get('/', function(req, res, next) {
  	res.render('index', { 
  		title: 'Top 10 noticias',
  	});
});


module.exports = router;
