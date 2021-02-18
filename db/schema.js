const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
    type Query{
        obtenerAlgo: String
    }
`;

module.exports = typeDefs;
