const express = require ('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('productos/add');
});

router.post('/add', isLoggedIn, async (req, res)=>{
   const { nombre, precio, stock } = req.body;
   const newProducto = {
    nombre,
    precio,
    stock
   };
   await pool.query('INSERT INTO producto SET ?', [newProducto]);
   req.flash('exito', 'Producto guardado exitosamente');
   res.redirect('/productos');
});

router.get('/', isLoggedIn, isLoggedIn, async (req, res)=>{
    const productos = await pool.query('SELECT * FROM producto');
    res.render('productos/list', {productos});
});

router.get('/delete/:id', isLoggedIn, async (req, res)=>{
    const { id } = req.params;
    await pool.query('DELETE FROM producto WHERE ID = ?', [id]);
    req.flash('exito', 'El producto se ha eliminado exitosamente')
    res.redirect('/productos');
});

router.get('/edit/:id', isLoggedIn, async (req, res)=>{
    const { id } = req.params;
    const producto = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
    res.render('productos/edit', {producto: producto[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res)=>{
    const { id } = req.params;
    const { nombre, precio, stock} = req.body;
    const newProducto = {
        nombre,
        precio,
        stock
    };
    await pool.query('UPDATE producto set ? WHERE id = ?', [newProducto, id]);
    req.flash('exito', 'Producto actualizado exitosamente')
    res.redirect('/productos');
});
module.exports = router;