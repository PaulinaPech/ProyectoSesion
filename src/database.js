const mysql = require ('mysql');
const { promisify }= require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if (err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La conexion de la base de datos a sido cerrada');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tiene muchas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexion de la base de datos fue interrumpida');
          }
    }
    if (connection) connection.release();
    console.log('La base de datos esta conectada');
  
    return;
});

//Promesas que eran callbacks
pool.query = promisify(pool.query);

module.exports = pool;
