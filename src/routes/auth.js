const express = require('express');
const crypto = require('crypto')//libreria para encriptar la contraseña y crear el salt
const jwt = require('jsonwebtoken'); 
const Users = require('../models/Users');
const { isAuthenticated} = require('../auth/index')

const router = express.Router();

const signToken = (_id) => {//recibe el id del usuario 
    return jwt.sign({ _id}, 'mi-secreto',{//retorna el token encriptado 
        expiresIn: 60 * 60 * 24 * 365,// recibe un objeto de configuracion donde le indicamos cuanto tiempo va a durar la llave del usuario atravez de la propiedad expriresIn
    })
}//UN AÑO ENTERO??

router.post('/register',(req,res)=>{
    const {email, password} = req.body //obtenemos el email y contraseña
    crypto.randomBytes(16,(err, salt) => {//bytes aleatareos de 16, el callback retorna un bufer  
        const newSalt = salt.toString('base64')//transformamos el salt en un string
        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key)=>{// encriptamos la contraseña
    //pbkdf2 (contraseña, el salt, cantidad de iteraciones, longitud de la llave, algoritmo de encriptacion, callback )
            const encryptedPassword = key.toString('base64')//pasamos a string
            Users.findOne({ email }). exec()//busca un usuario por el email
                .then(user => {
                    if(user){
                        return res.send('usuario ya existe');
                    }
                    Users.create({//creamos el usuario
                        email,
                        password: encryptedPassword,
                        salt: newSalt,
                    }) 
                    .then(() =>{
                        res.send('usuario creado con éxito')
                    })
                })
        })
    })
})
router.post('/login',(req,res)=>{
    const { email, password} = req.body
    Users.findOne({email}).exec()
        .then(user => {
            if(!user){
                return res.send('usuario y/o contraseña incorrecta')
            }
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key)=>{//ENCRIpTAMOS LA CONTRASEÑA REcIDA
                const encryptedPassword = key.toString('base64')//la pasamos a un string
                if(user.password === encryptedPassword){//consultamos 
                    const token = signToken(user._id)
                    return res.send({ token })
                }
                res.send('usuario y/o contraseña incorrecta')
            })     
        })
})
router.get('/me', isAuthenticated,(req,res)=>{
    res.send(req.user)
})

module.exports = router; 