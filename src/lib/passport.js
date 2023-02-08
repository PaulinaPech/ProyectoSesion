const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, nombre, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE nombre = ?', [nombre]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword) {
            done(null, user, req.flash('exito', 'Bienvenido' + user.nombre));
        } else{
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    }else{
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, nombre, password, done) => {
    const { nombreCompleto } = req.body;
    const newUser = {
        nombre,
        password,
        nombreCompleto
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuario Where id = ?', [id]);
    done(null, rows[0]);
});