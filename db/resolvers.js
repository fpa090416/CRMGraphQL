const Usuario = require('../models/Usuario');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) =>{
    //console.log(usuario);
    const { id, email, nombre, apellido } = usuario;

    return jwt.sign( { id, email, nombre, apellido }, secreta, { expiresIn } )
}


//Resolver
const resolvers = {
    Query: {
        obtenerCurso: ()=>"Algo"
    },
    Mutation:{
        nuevoUsuario: async (_,{input})=>{
            const { email, password } = input;

            //Revisando si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if(existeUsuario){
                throw new Error('El usuario ya existe')
            }

            //Hashear el password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try{
                //Guardar en la base de datos
                const usuario = new Usuario(input);
                usuario.save() //Guardar en la base de datos
                return usuario;
            } catch(error){
                console.log(error);
            }
        },
        autenticarUsuario: async(_,{input})=>{
            const { email, password } = input;

            //Verificar si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if(!existeUsuario){
                throw new Error(`El usuario ${email} no existe en la base de datos`)
            }

            //Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password );
            if(!passwordCorrecto){
                throw new Error('El password es Incorrecto');
            }
            //Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        }
    }
}

module.exports = resolvers;