// BASE SETUP
// ==============================================

const express = require('express');
const app     = express();
const port    = process.env.PORT || 8000;

const cors = require( 'cors' );
const empleadoModel = require( './models/Empleado');

const empleadosRoute = require( './routes/empleados' );
var jsonFile = require('./dataset.json');


const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb+srv://bicg-victoria:bicg-victoria@cluster0-apxhb.gcp.mongodb.net/BICG?retryWrites=true', {useNewUrlParser: true});

const connection = mongoose.connection;
connection.on( 'connected', function(){
    console.log( 'connected to db' );

//   empleadoModel.collection.insert(jsonFile, function (err, docs) {
//     if (err){ 
//         return console.error(err);
//     } else {
//       console.log("Multiple documents inserted to Collection");
//     }
//   });


});
connection.on( 'disconnected', function(){
    console.log( 'disconnected from db' );
});
connection.on( 'error', function(error){
    console.log( 'db error: ', error );
});


app.use( cors() );

// ROUTES
app.use('/', empleadosRoute );


// START THE SERVER
app.listen( port );
console.log('listening to port ' + port );