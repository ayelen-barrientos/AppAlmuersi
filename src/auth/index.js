const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

//middlewares
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization//sacamos el token dentro de la peticion pedida por el usuario 
    if(!token){
        return res.sendStatus(403)
    }
    jwt.verify(token,'mi-secreto',(err, decoded) =>{
        const {_id} = decoded//sacamos el id que contiene decoded
        Users.findOne({_id}).exec()//buscamos el usuario por el id
        .then(user => {
            req.user = user
            next()
        })
    })
}
//para manejar mas de un tipo de rol en una ruta
const hasRoles = roles => (req, res, next) =>{
    if(roles.indexOf(req.user.role) > -1) {//verifica la existencia del rol 
        return next()
    }
    res.sendStatus(403)
}

module.exports = { isAuthenticated, hasRoles,}
