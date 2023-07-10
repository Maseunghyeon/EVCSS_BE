const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type User{
        ID:ID!
        NAME:String
        EMAIL:String
        PASSWORD:String
        DEPARTMENT:String
        USE_FLAG:String
        CRT_DT:String
        CRT_USR:String
        UPD_DT:String
        UPD_USR:String
        PIC_FILE_PATH:String
        CAMP:String
    }

    type Query {
        getUsersAll: [User]
        getUsersByID(ID: [String]!): [User]
    }
    `;

module.exports = typeDefs;
