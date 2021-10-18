const express = require('express');
const Orders = require('../models/Orders');
const { isAuthenticated, hasRoles } = require('../auth/index')

const router = express.Router();
// const {Router} = require('express');
// const router = Router();

router.get('/',(req,res)=>{
    Orders.find()
    .exec()
    .then(x => res.status(200).send(console.log(x)))
})

router.get('/:id',(req,res)=>{
    Orders.findById(req.params.id)
    .exec()
    .then(x => res.status(200).send(x))
})

router.post('/',isAuthenticated,(req,res)=>{
   const {_id} = req.user//guardamos el id en el servidor
   Orders.create( {...req.body, user_id: _id}).then(x => res.status(201).send(x))
    // Orders.create(req.body).then(x => res.status(201).send(x))
})

router.put('/:id', isAuthenticated, hasRoles(['admin', 'user']),(req,res)=>{//aseguramos que unicamente ingresen a la ruta esos perfiles 
   Orders.findOneAndDelete(req.params.id, req.body)
    .then(() => res.sendStatus(204))
})

router.delete('/:id', isAuthenticated,(req,res)=>{
    Orders.findOneAndDelete(req.params.id).exec(). then(() => res.sendStatus(204))
})
module.exports = router; 