const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');

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
        obtenerUsuario: async(_,{ token }) =>{
            const usuarioId= await jwt.verify(token, process.env.SECRETA)

            return usuarioId;
        },

        //PRODUCTOS

        obtenerProductos: async ()=>{
            try{
                const productos = await Producto.find({});
                return productos;
            }catch(error){
                console.log(error);
            }
        },
        obtenerProducto: async(_,{ id })=>{
            //revisar si el producto existe o no
            const producto = await Producto.findById(id);

            if(!producto){
                throw new Error('Producto no encontrado');
            }
            return producto;
        },

        //Clientes

        obtenerClientes: async() => {
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor: async(_,{},ctx)=>{
            try {
                const clientes = await Cliente.find({vendedor: ctx.usuario.id.toString()});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        }

    },

    Mutation:{

        //USUARIOS

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

            //Revisar estado

            //Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },

        //PRODUCTOS

        nuevoProducto: async (_, {input})=>{
            try{
                const producto = new Producto(input);

                //almacenar en la bd
                const resultado = await producto.save();

                return resultado;
            }catch(error){
                console.log(error);
            }
        },
        actualizarProducto: async(_,{id, input})=>{
            //revisar si el producto existe o no
            let producto = await Producto.findById(id);

            if(!producto){
                throw new Error('Producto no encontrado');
            }

            //guardalo en la base de datos
            producto = await Producto.findOneAndUpdate({ _id:id },input,{ new:true });

            return producto;
        },
        eliminarProducto: async(_,{id})=>{
            //revisar si el producto existe o no
            let producto = await Producto.findById(id);

            if(!producto){
                throw new Error('Producto no encontrado');
            }
            //eliminar producto
            await Producto.findOneAndDelete({_id: id});
            // return "Producto Eliminado";
            return `El producto ${producto.nombre} se elimino correctamente`
        },

        //Clientes

        nuevoCliente: async(_,{ input }, ctx)=>{

            const { email } = input
            // Verificar si el cliente ya esta registrado
            //console.log(input);

            const cliente = await Cliente.findOne({email});
            if(cliente){
                throw new Error('Ese Cliente ya esta registrado');
            }
            const nuevoCliente = new Cliente(input);
            //asignar el vendedor
            nuevoCliente.vendedor = ctx.usuario.id;
            //guardarlo en la base de  datos
            try {
                const resultado = await nuevoCliente.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }  
        },
        actualizarCliente: async (_,{id,input}, ctx)=>{
            //verificar si existe o no
            let cliente = await Cliente.findById(id);

            if(!cliente){
                throw new Error('Ese Cliente no existe');
            }
            //verificar si es el vendedor el que edita
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }
            //guardar el cliente
            cliente = await Cliente.findOneAndUpdate({_id: id}, input,{new:true});
            return cliente;
        },
        eliminarCliente: async (_,{id},ctx)=>{
            //verificar si existe o no
            let cliente = await Cliente.findById(id);

            if(!cliente){
                throw new Error('Ese Cliente no existe');
            }
            //verificar si es el vendedor el que edita
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }
            //Eliminar cliente
            await Cliente.findOneAndDelete({_id: id});
            return 'Cliente Eliminado';
        }
    }
}

module.exports = resolvers;