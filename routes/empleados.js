const express = require('express');
const empleadoModel = require('../models/Empleado');


const router = express.Router();

router.get('/', (req, res) => {
    console.log( "get all empleados..." );
    empleadoModel.find( {}, function(err, empleados){
        console.log( "callback... ", empleados );
        if( err ){
            console.log( "got error: " + err );
        }
        res.json( empleados );
        
    } )
});

module.exports = router;
