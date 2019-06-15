const mongoose = require('mongoose');
const schema = mongoose.Schema;


let empleadoSchema = new schema({  
    IdEmpleado: String,
    Nombre: String,
    AñoIncorporación: Number,
    Sueldo: String,
    Departamento: String
})

const empleadoModel = mongoose.model( 'Empleado', empleadoSchema );

module.exports = empleadoModel;
