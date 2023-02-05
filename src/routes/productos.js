const express = require ('express');
const router = express.Router();
const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('productos/add');
});

router.post('/add', async (req, res)=>{
   const { nombre, precio, stock } = req.body;
   const newProducto = {
    nombre,
    precio,
    stock
   };
   await pool.query('INSERT INTO producto SET ?', [newProducto]);
   res.redirect('/productos');
});

router.get('/', async (req, res)=>{
    const productos = await pool.query('SELECT * FROM producto');
    res.render('productos/list', {productos});
});

router.get('/delete/:id', async (req, res)=>{
    const { id } = req.params;
    await pool.query('DELETE FROM producto WHERE ID = ?', [id]);
    res.redirect('/productos');
});

router.get('/edit/:id', async (req, res)=>{
    const { id } = req.params;
    const producto = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
    res.render('productos/edit', {producto: producto[0]});
});

router.post('/edit/:id', async (req, res)=>{
    const { id } = req.params;
    const { nombre, precio, stock} = req.body;
    const newProducto = {
        nombre,
        precio,
        stock
    };
    await pool.query('UPDATE producto set ? WHERE id = ?', [newProducto, id]);
    res.redirect('/productos');
});
module.exports = router;