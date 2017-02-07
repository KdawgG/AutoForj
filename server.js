
'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')
const handWrite = require("./handy")

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', function(req,res,next){
	if (req.body.output.indexOf('Gandhi') > -1){
		res.send( './KD.jpg')
	}else if (req.body.output.indexOf('astalavista') > -1 ){
		res.send( './astalavista.jpg')
	}else handWrite(req.body.output, req.body.user, req.body.width)
		.then(()=> setTimeout(()=> res.send( './result.png?v='+Math.random()),250))
})

app.listen(3000, function () {
  console.log('Server listening on port', 3000);
});
