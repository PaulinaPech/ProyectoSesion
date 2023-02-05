const express = require ('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');



//Inicializar 
const app= express();

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  }))
app.set('view engine', '.hbs');

//Peticiones
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Variables globales
app.use((req, res, next)=>{
    next();
});


//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/productos', require('./routes/productos'));

//Archivos publicos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
  });



