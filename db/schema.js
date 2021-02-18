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
    }
    # type Login{
    #     emal: String
    #     fecha: String
    # }
    type Token{
        token: String
    }

    ##Inputs
    input UsuarioInput{
        nombre: String!
        apellido: String!
        email:String!
        password: String!
    }
    input AutenticarInput{
        email: String!
        password: String!
    }
    # input LoginInput{
    #     email: String!
    # }

    ##Funciones
    type Query{
        obtenerCurso: String
    }

    type Mutation{
        ##Usuario
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
    }
`;

module.exports = typeDefs;
