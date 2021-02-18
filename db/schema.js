const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
    ##Types's
    type Usuario{
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
        estado: Int
        rol: Roles
    }
    type Token{
        token: String
    }
    type Producto{
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
    }
    type Cliente{
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }

    enum Roles{
        ADMINISTRADOR
        TECNICO
    }

    ##Inputs
    input UsuarioInput{
        nombre: String!
        apellido: String!
        email:String!
        password: String!
        rol: Roles!
    }
    input AutenticarInput{
        email: String!
        password: String!
    }
    input ProductoInput{
        nombre: String!
        existencia: Int!
        precio: Float!
    }
    input ClienteInput{
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }


    ##Funciones
    type Query{
        ##Usuarios
        obtenerUsuario(token: String!) : Usuario

        #Productos
        obtenerProductos : [Producto]
        obtenerProducto(id: ID!) : Producto

        #Clientes
        obtenerClientes:[Cliente]
        obtenerClientesVendedor:[Cliente]
    }

    type Mutation{
        ##Usuario
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token

        #Productos
        nuevoProducto(input: ProductoInput) : Producto
        actualizarProducto(id: ID!, input: ProductoInput): Producto
        eliminarProducto(id: ID!): String

        #Clientes
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id: ID!, input: ClienteInput): Cliente
        eliminarCliente(id:ID!):String
    }
`;

module.exports = typeDefs;
